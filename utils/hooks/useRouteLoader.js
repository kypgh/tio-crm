import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";

export default function useRouteLoader() {
  const router = useRouter();

  useEffect(() => {
    if (!router.events) return;

    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);
}
