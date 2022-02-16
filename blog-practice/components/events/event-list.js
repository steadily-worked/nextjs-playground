import EventItem from "./event-item";

export default function EventList(props) {
  const { items } = props;
  return (
    <ul>
      {items.map((event) => (
        <EventItem />
      ))}
    </ul>
  );
}
