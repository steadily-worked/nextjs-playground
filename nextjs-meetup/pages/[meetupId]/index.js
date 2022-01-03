import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
        //   image="https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg"
        //   title="First Meetup"
        //   address="Some Street 5, Some City"
        //   description="This is a first meetup"
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:4321@cluster0.nzqrp.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  // 첫번째 {}: 모든객체를 가져옴
  // 두번째 {}: 모든 문서가 추출되어야 하는 필드를 정의
  // "_id: 1": id만 포함하고 다른 필드값은 포함하지 않는다.

  client.close();

  return {
    fallback: false,
    // false: 지정되는 모든 paths를 정의함
    // true: 특정 path만 정의함 (pre-generate)
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
      // 이후에 들어가면
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://admin:3720@cluster0.nzqrp.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  console.log(meetupId);

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
      //   {
      //     image:
      //       "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
      //     id: meetupId,
      //     title: "First Meetup",
      //     address: "Some Street 5, Some City",
      //     description: "This is a first meetup",
      //   },
    },
  };
}

export default MeetupDetails;
