// Types pour les tests

export interface TestConfig {
  setupFilesAfterEnv?: string[]
  testEnvironment?: 'jsdom' | 'node'
  moduleNameMapping?: Record<string, string>
  collectCoverageFrom?: string[]
  coverageThreshold?: {
    global?: {
      branches?: number
      functions?: number
      lines?: number
      statements?: number
    }
  }
}

export interface TestUtils {
  render: (component: React.ReactElement, options?: RenderOptions) => RenderResult
  screen: Screen
  waitFor: (callback: () => void | Promise<void>, options?: WaitForOptions) => Promise<void>
  waitForElementToBeRemoved: (callback: () => HTMLElement | null, options?: WaitForOptions) => Promise<void>
  fireEvent: FireEvent
  userEvent: UserEvent
}

export interface RenderOptions {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
  container?: HTMLElement
  baseElement?: HTMLElement
  hydrate?: boolean
}

export interface RenderResult {
  container: HTMLElement
  baseElement: HTMLElement
  debug: (element?: HTMLElement) => void
  unmount: () => void
  rerender: (ui: React.ReactElement) => void
  asFragment: () => DocumentFragment
}

export interface Screen {
  getByRole: (role: string, options?: GetByRoleOptions) => HTMLElement
  getByText: (text: string | RegExp, options?: GetByTextOptions) => HTMLElement
  getByLabelText: (text: string | RegExp, options?: GetByLabelTextOptions) => HTMLElement
  getByPlaceholderText: (text: string | RegExp, options?: GetByPlaceholderTextOptions) => HTMLElement
  getByTestId: (testId: string) => HTMLElement
  queryByRole: (role: string, options?: GetByRoleOptions) => HTMLElement | null
  queryByText: (text: string | RegExp, options?: GetByTextOptions) => HTMLElement | null
  queryByLabelText: (text: string | RegExp, options?: GetByLabelTextOptions) => HTMLElement | null
  queryByPlaceholderText: (text: string | RegExp, options?: GetByPlaceholderTextOptions) => HTMLElement | null
  queryByTestId: (testId: string) => HTMLElement | null
  findByRole: (role: string, options?: GetByRoleOptions) => Promise<HTMLElement>
  findByText: (text: string | RegExp, options?: GetByTextOptions) => Promise<HTMLElement>
  findByLabelText: (text: string | RegExp, options?: GetByLabelTextOptions) => Promise<HTMLElement>
  findByPlaceholderText: (text: string | RegExp, options?: GetByPlaceholderTextOptions) => Promise<HTMLElement>
  findByTestId: (testId: string) => Promise<HTMLElement>
}

export interface GetByRoleOptions {
  name?: string | RegExp
  hidden?: boolean
  selected?: boolean
  checked?: boolean
  pressed?: boolean
  expanded?: boolean
  level?: number
}

export interface GetByTextOptions {
  selector?: string
  exact?: boolean
  ignore?: string | boolean
}

export interface GetByLabelTextOptions {
  selector?: string
  exact?: boolean
}

export interface GetByPlaceholderTextOptions {
  exact?: boolean
}

export interface FireEvent {
  click: (element: HTMLElement) => void
  change: (element: HTMLElement, options?: ChangeEventOptions) => void
  submit: (element: HTMLElement) => void
  keyDown: (element: HTMLElement, options?: KeyboardEventOptions) => void
  keyUp: (element: HTMLElement, options?: KeyboardEventOptions) => void
  keyPress: (element: HTMLElement, options?: KeyboardEventOptions) => void
  focus: (element: HTMLElement) => void
  blur: (element: HTMLElement) => void
  mouseEnter: (element: HTMLElement) => void
  mouseLeave: (element: HTMLElement) => void
  mouseOver: (element: HTMLElement) => void
  mouseOut: (element: HTMLElement) => void
  mouseMove: (element: HTMLElement) => void
  mouseDown: (element: HTMLElement) => void
  mouseUp: (element: HTMLElement) => void
  drag: (element: HTMLElement, options?: DragEventOptions) => void
  drop: (element: HTMLElement, options?: DropEventOptions) => void
  scroll: (element: HTMLElement, options?: ScrollEventOptions) => void
  wheel: (element: HTMLElement, options?: WheelEventOptions) => void
  copy: (element: HTMLElement) => void
  cut: (element: HTMLElement) => void
  paste: (element: HTMLElement, options?: ClipboardEventOptions) => void
  compositionStart: (element: HTMLElement, options?: CompositionEventOptions) => void
  compositionEnd: (element: HTMLElement, options?: CompositionEventOptions) => void
  compositionUpdate: (element: HTMLElement, options?: CompositionEventOptions) => void
}

export interface ChangeEventOptions {
  target?: {
    value?: string
    checked?: boolean
    files?: File[]
  }
}

export interface KeyboardEventOptions {
  key?: string
  code?: string
  keyCode?: number
  which?: number
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

export interface DragEventOptions {
  dataTransfer?: {
    files?: File[]
    items?: DataTransferItem[]
    types?: string[]
  }
}

export interface DropEventOptions {
  dataTransfer?: {
    files?: File[]
    items?: DataTransferItem[]
    types?: string[]
  }
}

export interface ScrollEventOptions {
  target?: {
    scrollLeft?: number
    scrollTop?: number
  }
}

export interface WheelEventOptions {
  deltaX?: number
  deltaY?: number
  deltaZ?: number
  deltaMode?: number
}

export interface ClipboardEventOptions {
  clipboardData?: {
    files?: File[]
    items?: DataTransferItem[]
    types?: string[]
  }
}

export interface CompositionEventOptions {
  data?: string
}

export interface UserEvent {
  click: (element: HTMLElement) => Promise<void>
  dblClick: (element: HTMLElement) => Promise<void>
  type: (element: HTMLElement, text: string, options?: TypeOptions) => Promise<void>
  clear: (element: HTMLElement) => Promise<void>
  selectOptions: (element: HTMLElement, values: string | string[]) => Promise<void>
  deselectOptions: (element: HTMLElement, values: string | string[]) => Promise<void>
  upload: (element: HTMLElement, files: File | File[]) => Promise<void>
  tab: (options?: TabOptions) => Promise<void>
  hover: (element: HTMLElement) => Promise<void>
  unhover: (element: HTMLElement) => Promise<void>
  keyboard: (text: string) => Promise<void>
  paste: (element: HTMLElement, text: string) => Promise<void>
  copy: (element: HTMLElement) => Promise<void>
  cut: (element: HTMLElement) => Promise<void>
}

export interface TypeOptions {
  delay?: number
  skipClick?: boolean
  skipAutoClose?: boolean
  initialSelectionStart?: number
  initialSelectionEnd?: number
}

export interface TabOptions {
  shift?: boolean
}

export interface WaitForOptions {
  timeout?: number
  interval?: number
  onTimeout?: (error: Error) => void
  mutationObserverOptions?: MutationObserverInit
}

export interface MockFunction<T = any> {
  (...args: any[]): T
  mock: {
    calls: any[][]
    instances: any[]
    contexts: any[]
    results: { type: 'return' | 'throw'; value: any }[]
    lastCall: any[]
    lastInstance: any
    lastContext: any
    lastResult: { type: 'return' | 'throw'; value: any }
    clearMock: () => void
    resetMock: () => void
    restoreMock: () => void
  }
}

export interface MockModule {
  [key: string]: MockFunction
}

export interface TestEnvironment {
  window: Window
  document: Document
  navigator: Navigator
  location: Location
  history: History
  localStorage: Storage
  sessionStorage: Storage
  fetch: MockFunction
  XMLHttpRequest: MockFunction
  setTimeout: MockFunction
  setInterval: MockFunction
  clearTimeout: MockFunction
  clearInterval: MockFunction
  requestAnimationFrame: MockFunction
  cancelAnimationFrame: MockFunction
  getComputedStyle: MockFunction
  matchMedia: MockFunction
  ResizeObserver: MockFunction
  IntersectionObserver: MockFunction
  MutationObserver: MockFunction
} 

