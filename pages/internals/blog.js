import React from "react";
import { PageOuter } from "../../components/generic";
import BlogManager from "../../components/blog/BlogManager";

const Blog = () => {
  return (
    <PageOuter>
      <BlogManager />
    </PageOuter>
  );
};

export default Blog;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
