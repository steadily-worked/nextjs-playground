import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

const HomePage = (props) => {
  return <MeetupList meetups={/*loadedMeetups*/ props.meetups} />;
};

// 1. static generation
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:1234@cluster0.nzqrp.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  // 배열을 갖게 됨
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
    // revalidate: next.js가 들어오는 요청에 대해
    // 페이지를 다시 렌더링할때까지 기다리는 시간
    // 즉 페이지에 요청이 계속 들어올 경우 10초마다 다시 데이터를 업데이트할 것 이라는 것이다.
  };
}

//
// 만약 매 요청이 있을 때마다라면? 2. getServerSideProps
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // build 프로세스 중에 실행되지 않음. deploy 후 서버에서 실행
//   // 즉 요청이 들어올 때마다 실행. 따라서 revalidate가 필요없음
//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
