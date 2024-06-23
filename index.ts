import { readdir } from "node:fs/promises";

// read all the files in the /notes directory
const files = await readdir("./notes", { recursive: true });

let homePageContent = ""

const baseHomePageFile = Bun.file("./baseHomePage.html");
const baseHomePageTemplate = await baseHomePageFile.text();

const baseSectionFile = Bun.file("./baseSection.html");
const baseSectionTemplate = await baseSectionFile.text();

// read all the content of /notes and bundle it as section name homePageContent
for (let i = 0; i < files.length; i++) {
  const contentFile = Bun.file("./notes/" + files[i]);
  const content = await contentFile.text();
  const date = new Date(contentFile.lastModified).toDateString();

  // insert content and date
  let _contentTemplate = baseSectionTemplate;
  let section = _contentTemplate.replace("<slot></slot>", content);
  section = section.replace("time", date);
  
  homePageContent += section;
}

// insert homePageContent in slot in homePageTemplate 
let _homePageTemplate = baseHomePageTemplate;
let homePage = _homePageTemplate.replace("<slot></slot>", homePageContent);

await Bun.write("index.html", homePage);