import { useState } from "react";

import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

interface FormData {
  title?: string;
  category?: string;
  image?: string;
  content?: string;
}

const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [publishError, setPublishError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleGenerateAIContent = async () => {
    if (!formData.title || !formData.category) {
      alert("Please enter title and category first.");
      return;
    }

    try {
      const prompt = `Write a short and concise blog post (no more than 2 paragraphs) titled "${formData.title}" in the context of "${formData.category}" for a military audience. Keep it under 300 words.`;

      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 769d21b8ec6579c65f79ac9b5f18aafca289dfc8bfab82ca54a5b1c549ed0eea",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      console.log("TogetherAI response:", data);

      const generatedText = data?.choices?.[0]?.message?.content;
      if (!generatedText) {
        alert("Failed to generate content.");
        return;
      }

      setFormData((prev) => ({ ...prev, content: generatedText }));
    } catch (error) {
      console.error("AI error", error);
      alert("Failed to generate content.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          />
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
          >
            <option value="uncategorized">Select a category</option>
            <option value="military-aid">Military Aid & Weapons</option>
            <option value="leadership">Leadership & Strategy</option>
            <option value="defense-policy">Defense Policy & Reforms</option>
            <option value="global-security">
              Global Security & Geopolitics
            </option>
          </Select>
          <Button
            type="button"
            onClick={handleGenerateAIContent}
            className="bg-blue-700 text-white self-end"
          >
            Generate with AI
          </Button>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-#4B5320-500 border-dotted p-3">
          <FileInput
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            className="bg-gradient-to-r from-[#4B5320] via-[#556B2F] to-[#8B8C7A] text-white"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={Number(imageUploadProgress) || 0}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          value={formData.content || ""}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        <Button
          type="submit"
          className="bg-gradient-to-r from-[#4B5320] via-[#556B2F] to-[#8B8C7A] text-white"
        >
          Publish
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
