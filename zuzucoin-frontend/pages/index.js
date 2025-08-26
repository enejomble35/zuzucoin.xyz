import dynamic from "next/dynamic";
export default dynamic(() => Promise.resolve(Home), { ssr: false });
