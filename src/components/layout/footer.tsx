interface FooterProps {
  content: string;
  icpNumber?: string;
  icpLink?: string;
}

export default function Footer({ content, icpNumber, icpLink }: FooterProps) {
  return (
    <footer className="text-violet-300 dark:text-cyan-200 text-center py-6 flex align-center justify-center">
      <p>&copy; {content}</p>
      {icpNumber && (
        <p>
          <a
            href={icpLink || "https://beian.miit.gov.cn/"}
            target="_blank"
            rel="noreferrer"
          >
            <span>&nbsp;|&nbsp;</span>
            <span className="hover:underline">{icpNumber}</span>
          </a>
        </p>
      )}
    </footer>
  );
}
