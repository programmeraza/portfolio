import { getDictionary, Locale } from "../../dictionaries";
import HomeClient from "./HomeClient";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <HomeClient dict={dict} lang={lang} />;
}
