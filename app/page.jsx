"use client";

import Feed from "@components/Feed";
import ShinyText from "@components/ShinyText";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <h1 className='head_text text-center'>
      Discover & Share
      <br className='max-md:hidden' />
      <ShinyText className='text-center orange_gradient'>
        AI-Powered Prompts
      </ShinyText>
    </h1>

    <p className='desc text-center'>
      Promptopia is an open-source AI prompting tool for the modern world to
      discover, create and share creative prompts.
    </p>

    <Feed />
  </section>
);

export default Home;
