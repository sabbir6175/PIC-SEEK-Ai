import { useContext } from "react";
import PageTitle from "../components/shared/PageTitle";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const Create = () => {
  const { user, login } = useContext(AuthContext);
  const options = [
    "painting",
    "animated-image",
    "walpaper",
    "poster",
    "digital-art",
    "realistic-image",
  ];

  const checkUser = () => {
    if (!user) {
      Swal.fire({
        title: "Please Login",
        text: "Join as a Creator with One Click",
        imageUrl: "https://img.icons8.com/?size=100&id=szz75vJoS2OI&format=gif",
        imageHeight: "80px",
        imageAlt: "Custom image",
        showCancelButton: true,
        confirmButtonText: `Login using Google`,
        confirmButtonColor: "#149b9b",
      }).then((res) => {
        if (res.isConfirmed) {
          login()
            .then((res) => {
              const user = res.user;
              console.log(user);
              Swal.fire("success", "Welcome", "success");
            })
            .catch((err) => {
              console.log(err);
              Swal.fire("Error", "Login failed. Please try again.", "error"); // Added error for login
            });
        }
      });
      return false;
    } else {
      return true;
    }
  };

  const validate = (prompt, category) => {
    // validation starts
    if (!category) {
      Swal.fire(
        "Select Category",
        "Select a Category from the dropdown",
        "error"
      );
      return false;
    }
    if (!prompt) {
      Swal.fire("Write a Prompt", "Write a prompt in the input", "error");
      return false;
    }
    // This 'if (!prompt)' check is redundant, removed it.
    if (prompt.trim().length < 20) {
      Swal.fire(
        "Invalid Prompt",
        "Make your prompt bigger (minimum 20 characters)",
        "error"
      );
      return false;
    }
    //validation End
    return true;
  };

  const handleSubmit = async (e) => { // Keep async, it's good practice for API calls
    e.preventDefault();
    const form = e.target;
    const prompt = form.prompt.value;
    const category = form.category.value;

    if (!checkUser()) return;
    if (!validate(prompt, category)) return;

    // Show a loading SweetAlert while the image is being generated
    Swal.fire({
      title: 'Generating Image...',
      text: 'Please wait while we create your masterpiece!',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    console.log({ prompt, category });
    try {
      const res = await axios.post("http://localhost:5000/api/v1/image/create", {
        email: user?.email,
        prompt,
        category,
        username: user?.displayName || "Anonymus",
        userImg:
          user?.photoURL ||
          "https://img.icons8.com/?size=96&id=z-JBA_KtSkxG&format=png",
      });

      console.log(res.data);
      Swal.fire("Success!", "Your image has been created!", "success"); // Success message
      form.reset(); // Optionally reset the form on success
      // You might want to update state here to display the image or redirect
      // For example:
      // setImageData(res.data.imageUrl); // Assuming res.data contains an image URL
    } catch (error) {
      console.error("Error creating image:", error);
      Swal.fire("Error!", "Failed to create image. Please try again.", "error"); // Error message
    }
  };

  return (
    <div>
      <PageTitle>🌱Let&apos;s Create 🐦‍🔥</PageTitle>

      <div className="w-11/12 mx-auto py-10">
        <div className="flex justify-center py-5">
          <img
            src="https://img.icons8.com/?size=96&id=8gR77jBNhfyz&format=png"
            alt=""
            className="animate-bounce"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="join w-full justify-center flex-wrap"
        >
          <div className="flex-1">
            <div className="">
              <input
                name="prompt"
                className="input w-full input-bordered join-item outline-none focus:outline-none focus:border-primary"
                placeholder="Write , Whats on your Mind🧠🧠"
              />
            </div>
          </div>
          <select
            name="category"
            className="select select-bordered join-item max-w-max outline-none focus:outline-none focus:border-primary"
          >
            <option value="">Select a Category</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="indicator">
            <button type="submit" className="btn join-item btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;