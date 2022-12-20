import React, { useRef } from 'react';
import { Box, Field, Stack, FieldLabel, Flex, FieldInput, FieldHint, FieldError } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import PropTypes from 'prop-types';

const EncryptableFieldInput = ({
                                 description,
                                 placeholder,
                                 disabled,
                                 error,
                                 intlLabel,
                                 labelAction,
                                 name,
                                 onChange,
                                 required,
                                 value,
                                 attribute
                               }) => {

  const {formatMessage} = useIntl();
  const ref = useRef(null);

  return (
    <Box>
      <Field
        id={name}
        name={name}
        hint={attribute.options?.hint ? attribute.options.hint : description ? description : ''}
        error={error}
        required={required}
      >
        <Stack spacing={1}>
          <Flex>
            <FieldLabel action={labelAction} required={required}>{formatMessage(intlLabel)}</FieldLabel>
          </Flex>
          <FieldInput
            ref={ref}
            id="encryptable-field-value"
            disabled={disabled}
            required={required}
            name={name}
            aria-label={formatMessage({
              id: getTrad('encryptable-field.input.aria-label'),
              defaultMessage: 'Encryptable input',
            })}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            hint={description}
          />
          <FieldHint/>
          <FieldError/>
        </Stack>
      </Field>
    </Box>
  )
}

EncryptableFieldInput.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
};

EncryptableFieldInput.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default EncryptableFieldInput
