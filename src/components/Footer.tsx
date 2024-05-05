/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  return (
    <p>
      Forked from{" "}
      <a
        className="underline"
        href="https://github.com/asrvd/lyrist"
        target={"_blank"}
        rel="noreferrer"
      >
        asrvd/lyrist
      </a>
      {" by "} <a className="underline"
        href="https://github.com/adielbm/lyrics"
        target={"_blank"}
        rel="noreferrer">adielbm</a>
    </p>
  );
}
