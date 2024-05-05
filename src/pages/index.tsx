import { NextPage } from "next";
import { useEffect, useState } from "react";
import { CheckIcon } from "../components/Icons/Check";
import { CopyIcon } from "../components/Icons/Copy";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";

type Lyrics = {
  lyrics: string;
  id: string;
  title: string;
  artist: string;
  image: string;
};

const Home: NextPage = () => {
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [trackName, setTrackName] = useState<string>("");

  const [runed, setRuned] = useState<boolean>(false);

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
      setLyrics(null);
      setLoading(true);
      const res = await fetch(`/api/${track}/${artist}`);

      if (res.ok) {
        const data = (await res.json()) as Lyrics;
        setLoading(false);
        setLyrics(data);
      } else {
        setLoading(false);
        if (res.status === 429) {
          toast.error("Rate limit exceeded!");
          return;
        } else {
          toast.error("Lyrics not found!");
        }
      }
    }
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
      handleClick().then(() => {
        setRuned(true);
      }).catch(() => {
        toast.error("An error occurred!");
      });
    }
  }, [trackName]);

  return (
    <Layout>
      <section className="gap-2 flex w-full flex-col items-center justify-center  md:w-2/3 lg:w-1/2">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <form className="w-full" onSubmit={(e) => {
            e.preventDefault();
            handleClick().then(() => {
              setRuned(true);
            }).catch(() => {
              toast.error("An error occurred!");
            });
          }}>
            <input
              className="w-full rounded-md border border-zinc-600 bg-zinc-800/60 px-4 py-2 text-pink-100 shadow-xl outline-0 placeholder:text-zinc-400 hover:outline-0"
              placeholder="Enter 'song' or 'song by artist'"
              value={trackName}
              onChange={handleTrackChange}
            />
          </form>
        </div>
        <div className="lyrics relative w-full scrollbar-thin scrollbar-track-transparent">
          {lyrics?.title &&
            <div className="flex rounded-md border border-zinc-600 bg-zinc-800/60 px-4 py-2 mb-2">
              <div>
                <b>{lyrics?.title}</b>
                <p>{lyrics?.artist}</p>
              </div>
              {/* album image */}
              <div className="ml-auto">
                <img
                  src={lyrics?.image}
                  alt="album"
                  className="h-12 rounded-md"
                />
              </div>
            </div>}
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
