import members from './members';
import {member_action_types, member_sort_keys, member_data_sources} from '../actions/member-actions';

describe('members reducer', () => {

    it('should handle MULTIPLE_MEMBER_UPDATES_RECEIVED', () => {
        const initialState = {
            members: [
                {id: 'c', firstName:'Fred', lastName: 'Flintstone'},
                {id: 'b', firstName: 'Barney', lastName: 'Rubble'},
                {id: 'f', firstName: 'Bambam', lastName: 'Flintstone'},
                {id: 'e', firstName: 'Dino', lastName: 'Saur'}
            ],
            selectedMember: undefined,
            dataSource: member_data_sources.API,
            sortKey: member_sort_keys.NAME
        };

        const updateAction = {
            type: member_action_types.MULTIPLE_MEMBER_UPDATES_RECEIVED,
            members: [
                {id: 'd', firstName:'Wilma', lastName: 'Flintstone'},
                {id: 'g', firstName: 'Jim', lastName: 'Beam'},
                {id: 'a', firstName: 'Boss', lastName: 'Hog'},
                {id: 'c', firstName: 'Luke', lastName: 'Duke'}
            ]
        };

        const expectedState = {
            members: [
                {id: 'g', firstName: 'Jim', lastName: 'Beam'},
                {id: 'c', firstName: 'Luke', lastName: 'Duke'},
                {id: 'f', firstName: 'Bambam', lastName: 'Flintstone'},
                {id: 'd', firstName:'Wilma', lastName: 'Flintstone'},
                {id: 'a', firstName: 'Boss', lastName: 'Hog'},
                {id: 'b', firstName: 'Barney', lastName: 'Rubble'},
                {id: 'e', firstName: 'Dino', lastName: 'Saur'}  
            ],
            selectedMember: undefined,
            dataSource: member_data_sources.API,
            sortKey: member_sort_keys.NAME
        };
        
        expect(members(initialState, updateAction))
        .toEqual(expectedState);
    });
});
