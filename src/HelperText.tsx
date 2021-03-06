import React, { forwardRef, useContext } from 'react';
import classNames from 'classnames';
import { transparentize } from 'polished';
import FormControlContext from './FormControlContext';
import createDynamicColorPalette from './createDynamicColorPalette';
import createStyles from './createStyles';
import { PropsFromStyles, ReactComponent } from './types';

const useStyles = createStyles(({ css, color, theme, givenSurface }) => {
  const bland = createDynamicColorPalette(theme.colors.bland, givenSurface);

  return {
    root: css`
      ${theme.fonts.caption};
      transition: color ${theme.durations.standard}ms;
    `,
    focused: css`
      color: ${color.onSurface};
    `,
    hasError: css`
      color: ${theme.colors.danger};
    `,
    disabled: css`
      color: ${transparentize(0.3, bland.onSurface)};
      cursor: not-allowed;
    `,
  };
});

type DivProps = JSX.IntrinsicElements['div'];
interface Props extends PropsFromStyles<typeof useStyles>, DivProps {
  component?: ReactComponent;
  focused?: boolean;
  hasError?: boolean;
  disabled?: boolean;
}

const HelperText = forwardRef(
  (props: Props, ref: React.Ref<HTMLDivElement>) => {
    const formControlContext = useContext(FormControlContext);
    const {
      Root,
      styles,
      component,
      focused: incomingFocused,
      hasError: incomingHasError,
      disabled: incomingDisabled,
      ...restOfProps
    } = useStyles(props, props.component ?? 'div');

    const focused = incomingFocused ?? formControlContext?.focused ?? false;
    const hasError = incomingHasError ?? formControlContext?.hasError ?? false;
    const disabled = incomingDisabled ?? formControlContext?.disabled ?? false;

    return (
      <Root
        className={classNames({
          [styles.focused]: focused,
          [styles.hasError]: hasError,
          [styles.disabled]: disabled,
        })}
        ref={ref}
        {...restOfProps}
      />
    );
  },
);

export default HelperText;
