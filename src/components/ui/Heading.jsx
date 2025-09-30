export default function Heading({ level = 1, children }) {
  const sizes = {
    1: "text-3xl font-bold mb-6",
    2: "text-2xl font-semibold mb-4",
    3: "text-xl font-medium mb-3",
  };

  const Tag = `h${level}`;

  return <Tag className={sizes[level]}>{children}</Tag>;
}
