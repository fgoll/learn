const appState = {
  title: {
    text: 'Hello1',
    color: 'red',
  },
  content: {
    text: 'Hello2',
    color: 'blue'
  }
}
function renderApp(newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return
  console.log('renderapp')
  renderTitle(newAppState.title, oldAppState.title)
  renderContent(newAppState.content, oldAppState.content)
}

function renderTitle(newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return
  console.log('rendertitle')
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newTitle.text
  titleDOM.style.color = newTitle.color
}

function renderContent(newContent, oldContent = {}) {
  if (newContent === oldContent) return
  console.log('rendercontent')
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newContent.text
  contentDOM.style.color = newContent.color
}


function createStore(reducer) {
  let state = null
  const listeners = []
  const subscribe = (listener) => { listeners.push(listener) }
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  dispatch({})
  return {getState, dispatch, subscribe}
}

function themeReducer(state, action) {
  if (!state) {
    return {
      title: {
        text: 'Hello1',
        color: 'red',
      },
      content: {
        text: 'Hello2',
        color: 'blue'
      }
    }
  }
  
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT': 
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      state.title.color = action.color
      return {
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state
  }
}

let store = createStore(themeReducer)
let oldState = store.getState()
store.subscribe(() => {
  let newState = store.getState()
  renderApp(newState, oldState)
  oldState = newState
})

renderApp(store.getState())

store.dispatch({type: 'UPDATE_TITLE_TEXT', text: '测试2'})
store.dispatch({type: 'UPDATE_TITLE_COLOR', color: 'green'})
