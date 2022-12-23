import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { fetchRoles } from '../../utils/api';
import { useQuery } from 'react-query';

type Role = {
  code: string;
  id: number;
  name: string;
};

type RoleOption = {
  key: string;
  value: number;
  metadatas: { intlLabel: { id: string; defaultMessage: string } };
};

const Multiselect = ({ intlLabel, name, options, error, description, onChange, value }) => {
  const { formatMessage } = useIntl();

  const { isLoading, data } = useQuery<Role[], Error>('roles', fetchRoles);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  useEffect(() => {
    if (data) {
      setRoles(
        data.map((role) => ({
          key: role.code,
          value: role.id,
          metadatas: {
            intlLabel: {
              id: `Settings.permissions.users.${role.code}`,
              defaultMessage: role.name,
            },
          },
        })),
      );
    }
  }, [data]);

  if (!Array.isArray(value)) value = [];

  const displayedValue = formatMessage(
    {
      id: 'custom-fields.content-type-builder.multiselect.placeholder',
      defaultMessage: '{number, plural, =0 {# fields} one {# field} other {# fields}} selected',
    },
    { number: value.filter((val) => val !== 'id').length },
  );

  return (
    <>
      {!isLoading && (
        <Box>
          <Select
            multi
            label={formatMessage(intlLabel)}
            customizeContent={() => displayedValue}
            name={name}
            onChange={(values) => {
              onChange({
                target: { name, value: [...values, 'id'] },
              });
            }}
            value={value.filter((val) => val !== 'id')}
            error={error}
            hint={formatMessage(description)}
          >
            {roles.map((option) => (
              <Option key={option.key} value={option.value}>
                {formatMessage(option.metadatas.intlLabel)}
              </Option>
            ))}
          </Select>
        </Box>
      )}
    </>
  );
};

Multiselect.propTypes = {
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }).isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      metadatas: PropTypes.shape({
        intlLabel: PropTypes.shape({
          id: PropTypes.string.isRequired,
          defaultMessage: PropTypes.string.isRequired,
        }).isRequired,
        disabled: PropTypes.bool,
        hidden: PropTypes.bool,
      }).isRequired,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  default: PropTypes.array,
};

export default Multiselect;
