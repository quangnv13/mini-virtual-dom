function App() {
  return {
    tag: "div",
    props: {
      children: [
        {
          tag: "h1",
          props: {
            children: ["Hello, world!"],
            style: { fontFamily: "sans-serif" },
          },
        },
        {
          tag: "p",
          props: {
            children: ["This is a paragraph."],
            style: { backgroundColor: "red", fontSize: "30px" },
          },
        },
        {
            tag: "button",
            props: {
              children: ["Click me"],
              style: { backgroundColor: "green", fontSize: "30px", cursor: 'pointer' },
              onClick: () => {console.log('click')}
            },
          },
      ],
    },
  };
}

export default App;
