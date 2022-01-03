import { useRouter } from "next/router";

// our-domain.com/news/something-important
const DetailPage = () => {
  const router = useRouter();

  console.log(router.query.newsId);
  // news/()에 입력한 값이 뜸
  // 백엔드 API에 요청해서 newsId에 뉴스 아이템을 fetch.

  return (
    <div>
      <h1>The Detail Page</h1>
    </div>
  );
};

export default DetailPage;
