import './App.css';
import React, { Component } from 'react';

import Transition from 'react-transition-group/Transition';
import { TransitionGroup } from 'react-transition-group';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered:  { opacity: 1 },
};

const Fade = ({ in: inProp, children }) => (
  <Transition
    in={inProp}
    timeout={duration}
    appear={true}
    mountOnEnter={true}
    unmountOnExit={true}
  >
    {(state) => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {children}
      </div>
    )}
  </Transition>
);

class TodoInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
  }

  handleChange = (e) => {
    const v = e.target.value;
    this.setState({
      value: v,
    });
  }

  handleSubmit = (e) => {
    if (!this.state.value) {
      return;
    }

    this.props.onSubmit(this.state.value);
    this.setState({
      value: '',
    })
  }

  render() {
    return (

        <div className="todo-input-container">
          <input
            className="todo-input"
            onChange={this.handleChange}
            value={this.state.value}
          />
          <button
            className="todo-button"
            onClick={this.handleSubmit}
          >
            Add
          </button>
        </div>
    );
  }
}

class TodoList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: null,
    }
  }

  handleFilterChange = (filter) => {
    this.setState({
      filter,
    });
  }

  render() {
    const filter = this.state.filter;

    const todos = this.props.todos
      .filter(todo => {
        switch (filter) {
          case true:
            return todo.completed;
          case false:
            return !todo.completed;
          default:
            return true;
        }
      });

    return (
      <div className="todo-list-container">
        <div className="todo-list-filters">
          <div className="">
            <button
              className={`todo-filter${filter === null ? '--active' : ''}`}
              onClick={() => {
                this.handleFilterChange(null);
              }}
            >
              All
            </button>
            <button
              className={`todo-filter${filter === false ? '--active' : ''}`}
              onClick={() => {
                this.handleFilterChange(false);
              }}
            >
              Remaining
            </button>
            <button
              className={`todo-filter${filter === true ? '--active' : ''}`}
              onClick={() => {
                this.handleFilterChange(true);
              }}
            >
              Completed
            </button>
          </div>
        </div>
        <div className="todo-list">
          {todos.length ? (
            <TransitionGroup>
              {todos.map(todo => (
                <Fade in={true} timeout={800} key={todo.id}>
                  <TodoItem
                    label={todo.label}
                    completed={todo.completed}
                    onRemoveClick={this.props.remove.bind(null, todo.id)}
                    onToggleClick={this.props.toggle.bind(null, todo.id)}
                  />
                </Fade>
            ))}
            </TransitionGroup>
          ) : (
            <div className="todo-item todo-item--empty">
              Nothing in this list
            </div>
          )}
        </div>
      </div>
    );
  }
}

const TodoItem = (props) => (
  <Fade in={true} timeout={800}>
    <div className={`todo-item ${props.completed ? 'todo-item--completed' : ''}`}>
      <div className="todo-item-label">
        {props.label}
      </div>
      <div>
        <button
          className="todo-button"
          onClick={props.onToggleClick}
        >
          x
        </button>
        <button
          className="todo-button"
          onClick={props.onRemoveClick}
        >
          -
        </button>
      </div>
    </div>
  </Fade>
)

const TodoCounter = ({ count }) => (
  <div className="todo-counter">
    {count} remaining tasks...
  </div>
)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 1, label: 'Task 1' },
        { id: 2, label: 'Task 2' },
        { id: 3, label: 'Task 3' },
      ],
    }
  }

  addTodo = (label) => {

    const newTodo = {
      id: this.state.todos.length + 1,
      label,
      completed: false,
    }

    const todos = this.state.todos.concat([newTodo]);

    this.setState({
      todos,
    })
  }

  removeTodo = (id) => {
    const todos = this.state.todos
      .filter(todo => todo.id !== id);

    this.setState({
      todos,
    })
  }

  toggleTodo = (id) => {
    const todos = this.state.todos
      .map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          }
        }
        return todo;
      });

    this.setState({
      todos,
    })
  }

  render() {

    const remaining = this.state.todos.filter(t => !t.completed).length;

    return (
      <div className="todo-app">
        <TodoInput onSubmit={this.addTodo} />
        <TodoList
          todos={this.state.todos}
          toggle={this.toggleTodo}
          remove={this.removeTodo}
        />
        <TodoCounter count={remaining} />
      </div>
    );
  }
}

export default App;
