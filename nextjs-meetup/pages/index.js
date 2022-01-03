import MeetupList from "../components/meetups/MeetupList";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A First Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
    address: "Some address 5, 12345 Some City",
    description: "This is a first meetup!",
  },
  {
    id: "m2",
    title: "A Second Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
    address: "Some address 10, 12345 Some City",
    description: "This is a second meetup!",
  },
];

const HomePage = (props) => {
  // const [loadedMeetups, setLoadedMeetups] = useState([]);
  // useEffect(() => {
  //   // http 요청을 보내고 데이터를 fetch함
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);
  // static generation 사용시 위 Hooks는 불필요함
  return <MeetupList meetups={/*loadedMeetups*/ props.meetups} />;
};

// 1. static generation
// export async function getStaticProps() {
//   // pre-rendering 동안 실행할 함수
//   // page를 위한 props를 준비시킴
//   // API로부터 데이터 fetch.
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//     revalidate: 10,
//     // revalidate: next.js가 들어오는 요청에 대해
//     // 페이지를 다시 렌더링할때까지 기다리는 시간
//     // 즉 페이지에 요청이 계속 들어올 경우 10초마다 다시 데이터를 업데이트할 것 이라는 것이다.
//   };
// }

//
// 만약 매 요청이 있을 때마다라면? 2. getServerSideProps
export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  // build 프로세스 중에 실행되지 않음. deploy 후 서버에서 실행
  // 즉 요청이 들어올 때마다 실행. 따라서 revalidate가 필요없음
  // fetch data from an API
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}

export default HomePage;

// Next는 사전 렌더링을 하고 그 결과를 띄우지만 이 컴포넌트에선 최초 렌더링 시 loadedMeetups 상태는
// 비어있는 배열이며 그이후 useEffect를 통해 값이 채워지게 된다. 이후 두번째 렌더링을 통해 값이
// 보여지는 형태인데, 이는 안좋은 사용자 경험을 제공할 수 있다. Next는 다행히 이에대한 해결책을 제공
