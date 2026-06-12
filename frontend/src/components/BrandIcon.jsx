export default function BrandIcon({ className = "" }) {
  const classes = ["brand-icon", className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-hidden="true">
      <span className="brand-icon__bar brand-icon__bar--one" />
      <span className="brand-icon__bar brand-icon__bar--two" />
      <span className="brand-icon__bar brand-icon__bar--three" />
      <span className="brand-icon__bar brand-icon__bar--four" />
    </div>
  );
}