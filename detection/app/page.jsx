"use client"
import Heading from "./utils/Heading";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

import { useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [open, setOpen] = useState(false);

  // redux states
  const isAuth = useSelector((state) => state.auth.isAuth)
  const user = useSelector((state) => state.auth.user)

  return (
    <>
      <Heading
        title={"App"}
        description={"App"}
        keywords={"App"}
      />
      <Navbar
        open={open}
        setOpen={setOpen}
        user={user}
        isAuth={isAuth}
      />
      <Hero setOpen={setOpen} />
    </>
  );
}
