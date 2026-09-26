const fields = [
  {
    name: "customer_name",
    label: "Full name",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "+961 71 123 456",
  },
  {
    name: "email",
    label: "Email (optional)",
    type: "email",
    placeholder: "name@example.com",
  },
  {
    name: "governorate",
    label: "Governorate",
    type: "text",
    placeholder: "Beirut",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "Beirut",
  },
{
  name: "street_name",
  label: "Street name",
  type: "text",
  placeholder: "Hamra Street",
},
{
  name: "address",
  label: "Building and delivery details",
  type: "text",
  placeholder: "Building name, floor, apartment",
},

];

export default function CheckoutForm({
  formData,
  onChange,
  onSubmit,
  errors,
  generalError,
  isSubmitting,
  buttonText = "Review order",

}) {
  return (
    <form className="checkout-form" onSubmit={onSubmit}>
      <h2>Delivery information</h2>

      {generalError && (
        <div className="checkout-error" role="alert">
          {generalError}
        </div>
      )}

      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>

          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={onChange}
          />

          {errors[field.name]?.[0] && (
            <small className="field-error">
              {errors[field.name][0]}
            </small>
          )}
        </div>
      ))}

      <div className="form-group">
        <label htmlFor="notes">Order notes (optional)</label>

        <textarea
          id="notes"
          name="notes"
          rows="4"
          placeholder="Any delivery instructions?"
          value={formData.notes}
          onChange={onChange}
        />

        {errors.notes?.[0] && (
          <small className="field-error">{errors.notes[0]}</small>
        )}
      </div>

      {errors.items?.[0] && (
        <small className="field-error">{errors.items[0]}</small>
      )}

      <button
        className="place-order-button"
        type="submit"
        disabled={isSubmitting}
      >
{isSubmitting ? "Checking prices..." : buttonText}      </button>
    </form>
  );
}