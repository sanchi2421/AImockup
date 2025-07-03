// RecordAnswerSection.jsx
import dynamic from "next/dynamic";

// Dynamically import the client-only component
const RecordAnswerSectionClient = dynamic(() => import("./RecordAnswerSectionClient"), {
  ssr: false,
});

export default function RecordAnswerSectionWrapper(props) {
  return <RecordAnswerSectionClient {...props} />;
}
