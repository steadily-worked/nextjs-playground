const Blog = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
};

// getStaticProps를 build time에 불러오기
export async function getStaticProps() {
  // posts를 얻기위해 외부 API를 호출함
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // { props: { posts } } 형태로 불러옴으로써 Blog 컴포넌트는 build time에 posts를 prop으로서 받게 된다.
  return {
    props: {
      posts,
    },
  };
}

export default Blog;
