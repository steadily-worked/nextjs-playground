import Link from "next/link";
import { Fragment } from "react";
// our-domain.com/news
const NewsPage = () => {
  return (
    <Fragment>
      <h1>The News Page</h1>
      <ul>
        <li>
          <Link href="/news/nextjs-is-a-great-framework">
            Next.js Is A Great Framework
          </Link>
          {/* 새 HTML 페이지를 얻기위해 브라우저가 보내는 요청을 막고
          대신 로드된 컴포넌트를 로드 후 URL을 바꿈 */}
        </li>
        <li>Something Else</li>
      </ul>
    </Fragment>
  );
};

export default NewsPage;
