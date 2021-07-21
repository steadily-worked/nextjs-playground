function Post({ post }) {
  // Render post
}

// getStaticPaths 함수는, 사전 렌더링 하고싶은 path를
// build time에 특정할 수 있게 해줌
export async function getStaticPaths() {
  // 외부 API 엔드포인트를 불러와서 posts를 얻음
  const res = await fetch("http://.../posts");
  const posts = await res.json();

  // posts에 기반하여, 사전 렌더링하고싶은 path를 얻음
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // build time에만 이 path들을 (post.id) 사전 렌더링 할 것임
  // { fallback: false }는 다른 라우트는 404를 띄워야 된다는 뜻
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // params는 post의 id를 포함한다.
  // 라우트가 '/posts/1'의 형태라면 params.id는 1인 것임
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  // props를 통해 post 데이터를 페이지로 넘긴다.
  return { props: { post } };
}

// 스스로에게 물어봤을 때, 유저의 요청 이전에 이 페이지를 띄워야되는지? 가 맞다면 Static Generation ㄱㄱ
// 그게 아니라면 SSR 하면 됨
