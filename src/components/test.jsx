'use client'
import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Element as SlateElement } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { css } from "@emotion/react";
import Image from "next/image";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Start writing your blog here..." }],
  },
];


const BlogEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Start writing your blog here..." }],
    },
  ]);
  console.log(value)

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "heading":
        return <HeadingElement {...props} />;
      case "list-item":
        return <ListItem {...props} />;
      case "bulleted-list":
        return <BulletedList {...props} />;
      case "numbered-list":
        return <NumberedList {...props} />;
      case "image":
        return <ImageElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const insertImage = (editor, url) => {
    const image = { type: "image", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, image);
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case "b":
          event.preventDefault();
          editor.exec({ type: "toggle_mark", mark: "bold" });
          break;
        case "i":
          event.preventDefault();
          editor.exec({ type: "toggle_mark", mark: "italic" });
          break;
        case "u":
          event.preventDefault();
          editor.exec({ type: "toggle_mark", mark: "underline" });
          break;
        default:
          break;
      }
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
      <div>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            const url = prompt("Enter the image URL");
            if (!url) return;
            insertImage(editor, url);
          }}
        >
          Add Image
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
        placeholder="Write your blog..."
      />
    </Slate>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const HeadingElement = (props) => {
  const { level = 1 } = props.element;
  const Tag = `h${level}`;
  return <Tag {...props.attributes}>{props.children}</Tag>;
};

const ListItem = (props) => <li {...props.attributes}>{props.children}</li>;

const BulletedList = (props) => <ul {...props.attributes}>{props.children}</ul>;

const NumberedList = (props) => <ol {...props.attributes}>{props.children}</ol>;

const ImageElement = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <Image
        src={element.url}
        alt="User provided"
        css={css`
          max-width: 100%;
          height: auto;
        `}
      />
      {children}
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};


export default BlogEditor;
