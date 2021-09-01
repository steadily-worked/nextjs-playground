import { useState, useEffect, useCallback, useRef } from "react";

const useInfiniteScroll = (targetEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);
  //   const observer = new IntersectionObserver((entries) =>
  //     setIntersecting(entries.some((entry) => entry.isIntersecting))
  //   );

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) =>
          setIntersecting(entries.some((entry) => entry.isIntersecting))
        // entries에 entry.isIntersecting인지, 즉 intersecting인게 하나라도 있는지
        // 확인하는 some API. 있으면 setIntersecting이 true가 되고 없으면 false가 됨
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current);
    return () => {
      getObserver().disconnect();
      // getObserver()로 해줄 경우 최초에는 ref의 값이 null이므로 (!observerRef.current) 부터 진행이 되는데,
      // 이미 값이 들어와있기 때문에 만들어진 observer가 반환이 된다.
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
