import React, { useEffect } from 'react';
import { act, create } from 'react-test-renderer';
import DeferredPromise from './DeferredPromise';
import ThemeProvider from './ThemeProvider';
import createTheme from './createTheme';
import makeStyles from './makeStyles';

const theme = createTheme();

it('returns colors, styles, and the root component', async () => {
  const stylesHandler = jest.fn();
  const colorHandler = jest.fn();
  const rootHandler = jest.fn();
  const done = new DeferredPromise();

  const useStyles = makeStyles(color => {
    colorHandler(color);

    return {
      root: 'root',
      title: 'title',
    };
  });

  function Component(props) {
    const { Root, styles } = useStyles(props);

    useEffect(() => {
      stylesHandler(styles);
      rootHandler(Root);
      done.resolve();
    }, [Root, styles]);

    return <Root>blah</Root>;
  }

  await act(async () => {
    create(
      <ThemeProvider theme={theme}>
        <Component />
      </ThemeProvider>,
    );
    await done;
  });

  const styles = stylesHandler.mock.calls[0][0];
  const colors = colorHandler.mock.calls[0][0];
  const Root = rootHandler.mock.calls[0][0];

  expect(styles).toMatchInlineSnapshot(`
    Object {
      "root": "root",
      "title": "title",
    }
  `);
  expect(colors).toMatchInlineSnapshot(`
    Object {
      "asBackground": "#000",
      "bgContrast": "#fff",
      "onSurface": "#000",
    }
  `);
  expect(Root).toBeDefined();
});

it('composes the classnames', () => {
  const useStyles = makeStyles(() => ({
    root: 'root-from-styles',
    title: 'title-from-styles',
  }));

  function Component(props) {
    const { Root, styles, title } = useStyles(props);

    return (
      <Root>
        <h1 className={styles.title}>{title}</h1>
      </Root>
    );
  }

  let result;

  act(() => {
    result = create(
      <ThemeProvider theme={theme}>
        <Component
          className="root-from-class-name"
          style={{ border: '1px solid red' }}
          styles={{
            root: 'root-from-incoming-styles',
            title: 'title-from-incoming-styles',
          }}
          title="test title"
        />
      </ThemeProvider>,
    );
  });

  expect(result).toMatchInlineSnapshot(`
    <div
      className="root-from-styles root-from-incoming-styles root-from-class-name"
      style={
        Object {
          "border": "1px solid red",
        }
      }
    >
      <h1
        className="title-from-styles title-from-incoming-styles"
      >
        test title
      </h1>
    </div>
  `);
});
