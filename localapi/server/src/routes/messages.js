import { readDB, writeDB } from "../dbController.js";
import { v4 } from "uuid";

const getMsgs = () => readDB("messages");
const setMsgs = (data) => writeDB("messages", data);
const messagesRoute = [
  {
    // 전체 메시지를 가져오는 명령어
    method: "get",
    route: "/messages",
    handler: (req, res) => {
      const msgs = getMsgs();
      res.send(msgs);
      // 정의를 한 뒤 request에 send함
    },
  },
  {
    // id 하나에 대한 메시지 가져오기
    method: "get",
    route: "/messages/:id",
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const msg = msgs.find((m) => m.id === id);
        if (!msg) throw Error("not found");
        res.send(msg);
      } catch (err) {
        res.status(404).send({ error: err });
      }
    },
  },
  {
    // 메시지 만들기(create)
    method: "post",
    route: "/messages",
    handler: ({ body }, res) => {
      const msgs = getMsgs();
      const newMsg = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now(),
      };
      msgs.unshift(newMsg);
      //   데이터가 추가된 전체 완성 메시지가 구성됨
      setMsgs(msgs);
      res.send(newMsg);
    },
  },
  {
    // update message
    method: "put",
    route: "/messages/:id",
    handler: ({ body, params: { id } }, res) => {
      // 실제 id를 지정. 클라이언트에서는 id가 나와있는데 서버에는 없는 경우, 혹은 그 반대의 경우.. 오류가 날 가능성이 있음
      // 그에 대한 안전 대비책으로 try, catch
      try {
        const msgs = getMsgs();
        const targetIdx = msgs.findIndex((msg) => msg.id === id);
        if (targetIdx < 0) throw "메시지가 없습니다";
        if (msgs[targetIdx].userId !== body.userId) throw "사용자가 다릅니다";

        const newMsg = { ...msgs[targetIdx], text: body.text };
        msgs.splice(targetIdx, 1, newMsg); // targetIdx 1개 지우고 newMsg로 바꾸기
        setMsgs(msgs);
        res.send(newMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // delete message
    method: "delete",
    route: "/messages:id",
    handler: ({ body, params: { id } }, res) => {
      // 실제 id를 지정. 클라이언트에서는 id가 나와있는데 서버에는 없는 경우, 혹은 그 반대의 경우.. 오류가 날 가능성이 있음
      // 그에 대한 안전 대비책으로 try, catch
      try {
        const msgs = getMsgs();
        const targetIdx = msgs.findIndex((msg) => msg.id === id);
        if (targetIdx < 0) throw "메시지가 없습니다";
        if (msgs[targetIdx].userId !== body.userId) throw "사용자가 다릅니다";

        msgs.splice(targetIdx, 1); // targetIdx 1개 지우고 newMsg로 바꾸기
        setMsgs(msgs);
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
