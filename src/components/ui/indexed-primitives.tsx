"use client"

import * as React from "react"
import { useComponentId } from "@/lib/component-id"

type PrimitiveProps<T extends React.ElementType> = React.ComponentPropsWithRef<T>

function createIndexedPrimitive<T extends React.ElementType>(
    tag: T,
    componentName: string
) {
    const Component = React.forwardRef<any, PrimitiveProps<T>>((props, ref) => {
        const componentId = useComponentId(componentName)
        const Component = tag as any
        return (
            <Component
                ref={ref}
                data-component-id={componentId}
                {...props}
            />
        )
    })
    Component.displayName = `Indexed.${componentName}`
    return Component
}

console.log("Initializing Indexed primitives...")

export const IndexedDiv = createIndexedPrimitive("div", "div")
export const IndexedSection = createIndexedPrimitive("section", "section")
export const IndexedHeader = createIndexedPrimitive("header", "header")
export const IndexedFooter = createIndexedPrimitive("footer", "footer")
export const IndexedMain = createIndexedPrimitive("main", "main")
export const IndexedNav = createIndexedPrimitive("nav", "nav")
export const IndexedArticle = createIndexedPrimitive("article", "article")
export const IndexedAside = createIndexedPrimitive("aside", "aside")

export const IndexedH1 = createIndexedPrimitive("h1", "h1")
export const IndexedH2 = createIndexedPrimitive("h2", "h2")
export const IndexedH3 = createIndexedPrimitive("h3", "h3")
export const IndexedH4 = createIndexedPrimitive("h4", "h4")
export const IndexedH5 = createIndexedPrimitive("h5", "h5")
export const IndexedH6 = createIndexedPrimitive("h6", "h6")

export const IndexedP = createIndexedPrimitive("p", "p")
export const IndexedSpan = createIndexedPrimitive("span", "span")
export const IndexedA = createIndexedPrimitive("a", "a")
export const IndexedImg = createIndexedPrimitive("img", "img")
export const IndexedUl = createIndexedPrimitive("ul", "ul")
export const IndexedOl = createIndexedPrimitive("ol", "ol")
export const IndexedLi = createIndexedPrimitive("li", "li")
export const IndexedButton = createIndexedPrimitive("button", "button")
export const IndexedInput = createIndexedPrimitive("input", "input")
export const IndexedLabel = createIndexedPrimitive("label", "label")
export const IndexedForm = createIndexedPrimitive("form", "form")

export const Indexed = {
    div: IndexedDiv,
    section: IndexedSection,
    header: IndexedHeader,
    footer: IndexedFooter,
    main: IndexedMain,
    nav: IndexedNav,
    article: IndexedArticle,
    aside: IndexedAside,

    h1: IndexedH1,
    h2: IndexedH2,
    h3: IndexedH3,
    h4: IndexedH4,
    h5: IndexedH5,
    h6: IndexedH6,

    p: IndexedP,
    span: IndexedSpan,
    a: IndexedA,
    img: IndexedImg,
    ul: IndexedUl,
    ol: IndexedOl,
    li: IndexedLi,
    button: IndexedButton,
    input: IndexedInput,
    label: IndexedLabel,
    form: IndexedForm,
}
