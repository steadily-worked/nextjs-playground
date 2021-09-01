import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from "../fetcher.js";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

// const originalMsgs = Array(50)
//   .fill(0)
//   .map((_, i) => ({
//     id: 50 - i,
//     userId: getRandomUserId(),
//     timestamp: 1234567890123 + i * 1000 * 60,
//     text: `${50 - i} mock text`,
//   }));

// console.log(JSON.stringify(originalMsgs));

const msgList = ({ smsgs, users }) => {
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const { query } = useRouter();
  const userId = query.userId || query.userid || "";

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("something wrong");
    // const newMsg = {
    //   id: msgs.length + 1,
    //   userId: getRandomUserId(),
    //   timestamp: Date.now(),
    //   text: `${msgs.length + 1} ${text}`,
    // };
    setMsgs((msgs) => [newMsg, ...msgs]);
    // 새 메시지를 첨에 추가하고, 뒤에는 ...msgs, 그러니까 이미 있는 메시지들..
    // 이것을 msgs로 setState해주기.
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error("something wrong");
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const doneEdit = () => setEditingId(null);

  // useEffect 내부에서 async를 쓸 수 없음
  const getMessages = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
      // 커서: 맨 마지막에 있는 id값. 최초에는 데이터가 없으므로 커서는 빈값일 수도 있게 || ""
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };
  // useEffect(() => {
  //   // 최초 시작 시에 설정
  //   getMessages();
  //   console.log("서버 연결 완료");
  // }, []);

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });

    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === receivedId + "");
      // ""를 더해준 이유: receivedId의 경우 기본적으로 V4를 통해 랜덤 부여해준 아이디는 무조건 문자열 처리가 되는데
      // 그게 아니라 처음에 우리가 지정해준 1~50의 경우는 우리가 "1", "50" 등으로 지정했으나 파싱하는 과정에서
      // 숫자로 인식이 될 여지가 있었다. 그래서 receivedId + ""를 해줌으로써 문자열로 바꿔주는 것이다.
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1);
      return newMsgs;
    });
  };

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

// editingId가 있을 때만 그 id에 대한 수정이 이뤄질 수 있는 것임
export default msgList;
