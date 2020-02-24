import React, { forwardRef } from 'react';
import { createStyles, PropsFromStyles } from 'react-style-system';
import { ReactComponent } from './types';

const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 0 0 auto;
    padding-bottom: ${theme.space(1)};
  `,
}));

type FooterProps = JSX.IntrinsicElements['footer'];
interface Props extends PropsFromStyles<typeof useStyles>, FooterProps {
  component?: ReactComponent;
}

const ModalFooter = forwardRef((props: Props, ref: React.Ref<HTMLElement>) => {
  const { Root, styles, component, ...restOfProps } = useStyles(
    props,
    props.component ?? 'footer',
  );
  return <Root ref={ref} {...restOfProps} />;
});

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
