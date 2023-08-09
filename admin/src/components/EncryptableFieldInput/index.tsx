import {
  Box,
  Field,
  Stack,
  FieldLabel,
  Flex,
  FieldInput,
  FieldHint,
  FieldError,
} from '@strapi/design-system';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTranslationId';
import { fetchUserRoles } from '../../utils/api';
import { useQuery } from 'react-query';

const encryptableFieldInput = ({
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
  attribute,
}): JSX.Element => {
  const { formatMessage } = useIntl();
  const reference = useRef(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const { isLoading, data } = useQuery<string[], Error>('user-roles', fetchUserRoles);

  useEffect(() => {
    if (data) {
      // If the field has no roles configured
      if (!attribute?.options?.roles) setIsDisabled(false);

      for (const id of data?.map((role: any) => role.id) ?? []) {
        if (attribute?.options?.roles?.includes(id.toString())) {
          setIsDisabled(false);
          break;
        }
      }
    }
  }, [data]);

  return (
    <>
      {!isLoading && (
        <Box>
          <Field
            id={name}
            name={name}
            hint={attribute.options?.hint ?? description ?? ''}
            error={error}
            required={required}
            disabled={isDisabled}
          >
            <Stack spacing={1}>
              <Flex>
                <FieldLabel action={labelAction} required={required}>
                  {formatMessage(intlLabel)}
                </FieldLabel>
              </Flex>
              <FieldInput
                ref={reference}
                id={`encryptable-field-value-${name}`}
                disabled={isDisabled}
                required={required}
                name={name}
                aria-label={formatMessage({
                  id: getTrad('encryptable-field.input.aria-label'),
                  defaultMessage: 'Encryptable input',
                })}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                type={isDisabled ? 'password' : undefined}
                hint={description}
              />
              <FieldHint />
              <FieldError />
            </Stack>
          </Field>
        </Box>
      )}
    </>
  );
};

encryptableFieldInput.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
};

encryptableFieldInput.propTypes = {
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

export default encryptableFieldInput;
