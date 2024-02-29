import React, { useRef, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import classes from "./../styles/alert.module.css";
import { IconImageInPicture } from "@tabler/icons-react";
//import { supabase } from "../supabase/supabaseClient";
import { Button, Stack, TextInput, Text, MultiSelect } from "@mantine/core";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import "@mantine/tiptap/styles.css";

import { IconSend } from "@tabler/icons-react";
import Compressor from "compressorjs";
import { encode } from "blurhash";
import { app } from "../firebase/firebase";
function AddAlert() {
  const [file, setFile] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | Blob>();
  const storage = getStorage(app);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState("info");
  const [message, setMessage] = useState("En cours de traitement ...");
  const [error, setError] = useState(false);
  const [openStack, setOpenStack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hashImage, setHashImage] = useState<string>("");
  const imgRef = useRef(null);
  //const context=useContext()
  const content =
    '<h4 style="text-align: center;">Bienvenu sur votre espace alerte</h4><p><code>Saisir votre alerte !!</code></p>';

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });
  function handleClick() {
    /* const { data, error } = await supabase.from('publications').insert([
    {uuid: },
  ]) */
  }

  const getImageBlurhash = async (image, width: number, height: number) => {
    return new Promise((resolve: (value: string) => void) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, width, height);

        const imageData = ctx?.getImageData(0, 0, width, height);
        const blurhash = encode(
          imageData!.data,
          imageData!.width,
          imageData!.height,
          4,
          3
        );
        resolve(blurhash);
      };
      img.src = URL.createObjectURL(image);
    });
  };
  function preview(e) {
    const image = e.target.files[0];
    if (!image) {
      return;
    }
    new Compressor(image, {
      quality: 0.1,
      success(compressedResult) {
        setCompressedFile(compressedResult);
      },
    });
    getImageBlurhash(image, 32, 32).then((hash) => {
      setHashImage(hash);
      setFile(
        e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null
      );
      //console.log(hash);
    });
  }

  function resetParam() {}
  function handleSubmit(e) {
    e.preventDefault();
    if (!compressedFile) {
      if (!edit) {
        setOpenStack(true);
      } else {
        setLoading(true);
        setMessage("Sauvegarde du produit modifier ...");
        const updateProd = async () => {
          await updateProduct(null)
            .then((r) => {
              onSucesss(r);
            })
            .catch((e) => {
              onCatch(e);
            })
            .finally(() => {
              onFinally();
              return;
            });
        };
        updateProd();
      }
      return;
    }
    setLoading(true);

    const pathId = !edit
      ? `alert-image/${Date.now()}-${compressedFile?.name}`
      : datas["pathImgID"];
    const storageRef = ref(storage, pathId);

    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progression =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progression);
        switch (snapshot.state) {
          case "paused":
            setState("Warning");
            setMessage("Un petit instant");
            break;
          case "running":
            setState("info");
            setMessage("En cours de traitement");
            break;
          default:
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
          case "storage/canceled":
          case "storage/unknown":
          default:
            setState("error");
            setMessage("Un truc s'est mal passer, Reesayer");
            setError(true);
            setTimeout(() => {
              resetParam();
            }, 3000);

            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          !edit
            ? setMessage("Sauvegarde du produit ...")
            : setMessage("Sauvegarde du produit modifier ...");
          if (!edit) {
            await addProduct(downloadURL, pathId)
              .then((r) => {
                onSucesss(r);
              })
              .catch((e) => {
                onCatch(e);
              })
              .finally(() => {
                onFinally();
              });
          } else {
            await updateProduct(downloadURL)
              .then((r) => {
                onSucesss(r);
              })
              .catch((e) => {
                onCatch(e);
              })
              .finally(() => {
                onFinally();
              });
          }
        });
      }
    );
  }
  function onSucesss(r) {
    //console.log(r);
  }
  function onCatch(e) {
    console.log(e);
  }
  function onFinally() {
    setTimeout(() => {
      resetParam();
    }, 3000);
  }

  return (
    <Stack>
      <div className={classes["file-import"]}>
        <input
          type="file"
          name="image"
          id="images"
          className={classes.images}
          accept=".jpg,.png,.jpeg,.gif,.bmp,.svg,.ico"
          onChange={preview}
        />
        <img
          id="target_import"
          className={classes["target_import"] + ` ${file ? "" : "hidden"}`}
          src={file}
          ref={imgRef}
          alt="TargetImage"
        />
        <IconImageInPicture
          className={classes["img_ajout"] + ` ${file && "hidden"}`}
        />
      </div>
      <TextInput
        label={<Text size="lg">Titre alerte</Text>}
        placeholder="titre alerte"
      />
      <MultiSelect
        label={<Text size="lg">Faculte de publication alerte</Text>}
        placeholder="Choisir la faculte"
        data={["Faculte de science", "Faculte de droit"]}
        searchable
      />
      <MultiSelect
        label={<Text size="lg">Departement de publication alerte</Text>}
        placeholder="Choisir la faculte"
        data={["Departement Informatique", "Departement Mathematique"]}
        searchable
      />
      <MultiSelect
        label={<Text size="lg">Choix de niveau d'alerte</Text>}
        placeholder="Choisir la faculte"
        data={["L1", "L2"]}
        searchable
      />
      <Text size="lg">Contenu alerte</Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky style={{ alignItems: "center" }}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup
            styles={{
              controlsGroup: {
                width: "100%",
              },
            }}
          >
            <Button
              size="compact-md"
              rightSection={<IconSend stroke={1.5} width={20} />}
              onClick={handleClick}
            >
              Publier
            </Button>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Stack>
  );
}

export default AddAlert;
