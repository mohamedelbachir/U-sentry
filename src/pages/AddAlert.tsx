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
import {
  TextInput,
  Button,
  Text,
  MultiSelect,
  Box,
  Group,
  Title,
} from "@mantine/core";

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
import {
  useFacultyList,
  useFiliereList,
  useMutationCreateAlert,
  useNiveauList,
  useDepartementList,
  useFacultyListById,
} from "../hooks/api";
import { useAuth } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function AddAlert() {
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
  const navigate = useNavigate();
  const [file, setFile] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | Blob>();
  const storage = getStorage(app);
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const { isAdmin, getAdminFunctionId } = useAuth();
  const fac = useFacultyList();
  const facWithId = useFacultyListById(getAdminFunctionId!);
  const { data: facList = [] } = isAdmin ? facWithId : fac;
  const { data: depList = [] } = useDepartementList();
  const { data: filiereList = [] } = useFiliereList();
  const { data: niveauList = [] } = useNiveauList();

  const [dep, setDep] = useState<
    {
      faculte_id: number;
      id: number;
      nom: string;
    }[]
  >([]);
  const [filiere, setFiliere] = useState<
    {
      departement_id: number | null;
      id: number;
      nom: string;
    }[]
  >([]);
  const [niveau, setNiveau] = useState<
    {
      id: number;
      nom: string;
    }[]
  >([]);

  const formRef = useRef();
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
    target: data.target!,
    content: editor?.getHTML(),
  });

  useEffect(() => {
    const l = depList.filter((d) => data.target?.facId?.includes(d.faculte_id));
    setDep(l);
  }, [data.target?.facId, depList]);

  useEffect(() => {
    const l = filiereList.filter((d) =>
      data.target?.facId?.includes(d.faculte_id)
    );
    setFiliere(l);
  }, [data.target?.facId, filiereList]);

  useEffect(() => {
    const l = niveauList.filter((d) =>
      data.target?.facId?.includes(d.faculte_id)
    );
    setNiveau(l);
  }, [data.target?.facId, niveauList]);

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
    console.log(data);

    setLoading(true);

    const pathId = `alert-image/${Date.now()}-${compressedFile?.name}`;
    const storageRef = ref(storage, pathId);

    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //const progression =
        // (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //setProgress(progression);
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
            //setWithError(true);
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
      setLoading(false);
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    }
  }, [createAlert.isSuccess]);
  return (
    <form id="formElement" onSubmit={handleSubmit} ref={formRef}>
      <Box pos={"sticky"} top={0} py={"md"} w={"100%"} className={classes.top}>
        <Group justify="space-between">
          <Title order={3}>Creer une alerte</Title>
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
      <MultiSelect
        mt={"xs"}
        label={
          <Text size="lg" span>
            Faculte de publication alerte
          </Text>
        }
        placeholder="Choisir la faculte"
        data={[
          ...facList.map((item) => ({
            label: item.nom,
            value: `${item.id}`,
          })),
        ]}
        onChange={(value) =>
          setData((data) => {
            return {
              ...data,
              target: { ...data.target, facId: value.map((v) => parseInt(v)) },
            };
          })
        }
        required
        searchable
      />
      <MultiSelect
        mt={"xs"}
        label={<Text size="lg">Departement de publication alerte</Text>}
        placeholder="Choisir le departement"
        data={[
          ...dep.map((item) => ({
            label: item.nom,
            value: `${item.id}`,
          })),
        ]}
        onChange={(value) =>
          setData((data) => {
            return {
              ...data,
              target: {
                ...data.target,
                depId: value.map((v) => parseInt(v)),
              },
            };
          })
        }
        searchable
      />
      <MultiSelect
        mt={"xs"}
        label={<Text size="lg">Choix de la filiere</Text>}
        placeholder="Choisir de la filiere"
        data={[
          ...filiere.map((item) => ({
            label: item.nom,
            value: `${item.id}`,
          })),
        ]}
        onChange={(value) =>
          setData((data) => {
            return {
              ...data,
              target: {
                ...data.target,
                filiereId: value.map((v) => parseInt(v)),
              },
            };
          })
        }
        searchable
      />
      <MultiSelect
        mt={"xs"}
        label={<Text size="lg">Choix de niveau d'alerte</Text>}
        placeholder="Choisir le niveau"
        data={[
          ...niveau.map((item) => ({
            label: item.nom,
            value: `${item.id}`,
          })),
        ]}
        onChange={(value) =>
          setData((data) => {
            return {
              ...data,
              target: {
                ...data.target,
                niveauId: value.map((v) => parseInt(v)),
              },
            };
          })
        }
        searchable
      />
      <Text size="lg" mt={"xs"}>
        Contenu alerte
      </Text>
      <Editor content={content} editor={editor!} />
    </form>
  );
}

export default AddAlert;
