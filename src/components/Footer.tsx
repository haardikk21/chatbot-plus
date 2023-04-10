import { haardikTwitter, repoGithub } from "@/constants";

export default function Footer() {
  return (
    <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Made with love by{" "}
      <a
        href={haardikTwitter}
        target="_blank"
        className="border-b border-gray-600 text-gray-600 dark:border-gray-300 dark:text-gray-300"
        rel="noreferrer"
      >
        @haardikkk.
      </a>{" "}
      View the source code on{" "}
      <a
        href={repoGithub}
        target="_blank"
        rel="noreferrer"
        className="border-b border-gray-600 text-gray-600 dark:border-gray-300 dark:text-gray-300"
      >
        Github.
      </a>
    </span>
  );
}
