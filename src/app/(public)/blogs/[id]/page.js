import blogs from "@/../public/fakedata/blogs.json";
import BlogDetailsMain from "@/components/layout/main/BlogDetailsMain";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Blog Details | ScholarPASS - Education LMS Template",
  description: "Blog Details | ScholarPASS - Education LMS Template",
};

const Blog_details = (props) => {
  const params = props.params;
  const { id } = params;
  const isExistBlog = blogs?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistBlog) {
    notFound();
  }
  return <BlogDetailsMain />;
};
export async function generateStaticParams() {
  return blogs?.map(({ id }) => ({ id: id.toString() }));
}
export default Blog_details;
