// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleContent, RuleContentProps } from 'common/components/cards/rule-content';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('RuleContent', () => {
    it('renders', () => {
        const props = {
            rule: {
                id: 'test-id',
            },
        } as RuleContentProps;

        const wrapper = shallow(<RuleContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
