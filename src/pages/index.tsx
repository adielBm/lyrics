import { NextPage } from "next";
import { useEffect, useState } from "react";
import { CheckIcon } from "../components/Icons/Check";
import { CopyIcon } from "../components/Icons/Copy";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";

type Lyrics = {
  lyrics: string;
  id: string;
};

const Home: NextPage = () => {
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [trackName, setTrackName] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const [runed, setRuned] = useState<boolean>(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackName(e.target.value);
  };



  const handleClick = async () => {
    if (trackName.trim() === "") {
      toast.error("Track name can't be empty!");
    } else {

      let artist = "", track = "";
      // if track name contains " by " then split it into track and artist
      if (trackName.includes(" by ")) {
        [track, artist] = trackName.split(" by ") as [string, string];
      } else {
        track = trackName;
      }

      setLoading(true);
      const res = await fetch(`/api/${track}/${artist}`);
      setLoading(false);

      if (res.ok) {
        const data = (await res.json()) as Lyrics;
        setLyrics(data);
      } else {
        if (res.status === 429) {
          toast.error("Rate limit exceeded!");
          return;
        } else {
          toast.error("Lyrics not found!");
        }
      }
    }
  };

  const handleEnterPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      await handleClick();
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(lyrics?.lyrics || "")
      .then(() => {
        setCopied(true);
        sleep(1000)
          .then(() => setCopied(false))
          .catch(() => null);
      })
      .catch(() => {
        toast.error("Couldn't Copy!");
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    if (query) {
      setTrackName(query);
    }
  }, []);

  useEffect(() => {
    if (runed == false && trackName.trim() !== "") {
      handleClick();
      setRuned(true);
    }
  }, [trackName]);

  return (
    <Layout>
      <section className="gap-2 flex w-full flex-col items-center justify-center  md:w-2/3 lg:w-1/2">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <input
            className="w-full rounded-md border border-zinc-600 bg-zinc-800/60 px-4 py-2 text-pink-100 shadow-xl outline-0 placeholder:text-zinc-400 hover:outline-0"
            placeholder="'trackname' or 'trackname by artist'"
            value={trackName}
            onChange={handleTrackChange}
            onKeyUp={handleEnterPress}
          />
        </div>
        <div className="lyrics relative w-full text-pink-200 scrollbar-thin scrollbar-track-transparent">
          <p className="whitespace-pre-line">
            {lyrics?.lyrics}
            {loading && "Loading..."}
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
