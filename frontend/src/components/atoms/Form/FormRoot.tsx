namespace FormRoot {
  export type Props = React.ComponentProps<'form'>;
}
function FormRoot({children, ...props}: FormRoot.Props) {
  return <form {...props}>{children}</form>;
}

export default FormRoot;
