/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
//@ts-ignore
import React, { useEffect, useRef, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import classes from "./../styles/alert.module.css";
import { IconImageInPicture } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";

import { TextInput, Button, Text, Box, Group, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import Compressor from "compressorjs";
import { encode } from "blurhash";
import { app } from "../firebase/firebase";
import Editor from "../components/Editor.component";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Link } from "@mantine/tiptap";
import { useMutationCreateAlert } from "../hooks/api";
import { useAuth } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function Publish() {
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
  });
  const [file, setFile] = useState<string | null>(null);
  const [key, setKey] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [compressedFile, setCompressedFile] = useState<File | Blob>();
  const storage = getStorage(app);
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const formRef = useRef();
  const navigate = useNavigate();
  const [data, setData] = useState<{
    description?: string;
    title?: string;
    imageurl?: string;
    hash?: string;
    content?: string;
    target?: {
      facId?: number[];
      depId?: number[];
      filiereId?: number[];
      niveauId?: number[];
    } | null;
  }>({ description: "", title: "", hash: "", imageurl: "" });

  const createAlert = useMutationCreateAlert({
    uuid: session?.user.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    description: editor?.getText()!,
    hash: data.hash!,
    imageUrl: data.imageurl!,
    title: data.title!,
    target: null,
    content: editor?.getHTML(),
  });
  //const context=useContext()
  const content = "";

  function handleClick() {
    /* const { data, error } = await supabase.from('publications').insert([
    {uuid: },
  ]) */
  }

  const getImageBlurhash = async (
    image: Blob | MediaSource,
    width: number,
    height: number
  ) => {
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
      setData((data) => {
        return { ...data, hash };
      });
      setFile(
        e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null
      );
      //console.log(hash);
    });
  }

  function resetParam() {}
  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!compressedFile) {
      return;
    }
    if (editor?.getText() === "") {
      notifications.show({
        title: "Information !!",
        message:
          "Veuillez renseigner une description pour capter l'attention a votre cible",
        autoClose: false,
        withBorder: true,
      });
      return;
    }
    const id = notifications.show({
      loading: true,
      title: "Votre diffusion en cours de publication",
      message: "Votre diffision est cours de publication ...",
      autoClose: false,
      withCloseButton: false,
      withBorder: true,
    });
    setId(id);
    console.log(data);

    setLoading(true);

    const pathId = `alert-image/${Date.now()}-${compressedFile?.name}`;
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
            console.log("en cours ...");

            break;
          case "running":
            console.log("traitement");

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
            console.log("erreur");
            setWithError(true);
            setTimeout(() => {
              resetParam();
            }, 3000);

            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setData((data) => {
            return { ...data, imageurl: downloadURL };
          });
          setTimeout(() => {
            createAlert.mutate();
          }, 1000);
        });
      }
    );
  }
  useEffect(() => {
    if (createAlert.isSuccess) {
      setFile(null);
      notifications.update({
        id,
        color: "teal",
        title: "Votre diffusion est envoye",
        message: "Votre diffusion a ete publier avec succes !!",
        icon: <IconCheck style={{ width: 18, height: 18 }} />,
        loading: false,
        autoClose: 2000,
      });
      editor?.setOptions({
        content: "",
      });
      setLoading(false);
      setKey((c) => c + 1);
    }
  }, [createAlert.isSuccess]);
  useEffect(() => {
    if (createAlert.isError) {
      notifications.hide(id);
      notifications.show({
        title: "Erreur !!",
        message: "Une erreur s'est produite lors de la publication d'alerte",
        autoClose: 2000,
        withBorder: true,
        color: "white",
        styles: {
          icon: {
            accentColor: "white",
          },
          title: {
            color: "white",
          },
          description: {
            color: "white",
          },
          root: {
            backgroundColor: "red",
          },
        },
      });
    }
  }, [createAlert.isError]);
  return (
    <form id="formElement" onSubmit={handleSubmit} ref={formRef} key={key}>
      <Box pos={"sticky"} top={0} py={"md"} w={"100%"} className={classes.top}>
        <Group justify="space-between">
          <Title order={3}>Faire une publication</Title>
          <Button
            size="compact-xl"
            rightSection={<IconSend stroke={1.5} width={20} />}
            onClick={handleClick}
            loading={loading}
            type="submit"
          >
            Publier
          </Button>
        </Group>
      </Box>
      <div className={classes["file-import"]}>
        <input
          type="file"
          name="image"
          id="images"
          className={classes.images}
          accept=".jpg,.png,.jpeg,.gif,.bmp,.svg,.ico"
          onChange={preview}
          required
        />
        <img
          id="target_import"
          className={classes["target_import"] + ` ${file ? "" : "hidden"}`}
          src={file as string | undefined}
          ref={imgRef}
          alt="TargetImage"
        />
        <IconImageInPicture
          className={classes["img_ajout"] + ` ${file && "hidden"}`}
        />
      </div>
      <TextInput
        label={
          <Text size="lg" span>
            Titre alerte
          </Text>
        }
        placeholder="titre alerte"
        required
        withAsterisk
        mt={"xs"}
        onChange={(e) =>
          setData((data) => {
            return { ...data, title: e.target.value };
          })
        }
      />
      <Text size="lg" mt={"xs"}>
        Contenu de la publication
      </Text>
      <Editor content={content} editor={editor!} />
    </form>
  );
}

export default Publish;
