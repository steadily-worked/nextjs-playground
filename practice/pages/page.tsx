function Page({ data }) {
  // Render data
}

// 매 요청시마다 아래 getServerSideProps 함수가 호출된다.
export async function getServerSideProps() {
  // 외부 API로부터 값을 fetch 해온다.
  const res = await fetch(`https://.../data`);
  const data = await res.json();

  // 이전과 마찬가지로, props를 통해 페이지에 데이터를 전송한다.
  return { props: { data } };
}

export default Page;
