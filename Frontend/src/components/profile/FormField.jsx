import { Form } from 'react-bootstrap'

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  options,
  as = 'input',
  rows,
  ...props
}) => {
  const inputStyle = {
    borderRadius: '8px',
    border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
    color: disabled ? '#9ca3af' : '#111827'
  }

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
          {label}
          {required && <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>}
        </Form.Label>
      )}
      {as === 'select' || type === 'select' ? (
        <Form.Select
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={inputStyle}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : as === 'textarea' ? (
        <Form.Control
          as="textarea"
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          rows={rows || 3}
          style={inputStyle}
          {...props}
        />
      ) : (
        <Form.Control
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          style={inputStyle}
          {...props}
        />
      )}
      {error && (
        <Form.Text className="text-danger" style={{ fontSize: '12px', marginTop: '4px' }}>
          {error}
        </Form.Text>
      )}
    </Form.Group>
  )
}

export default FormField
