import {apiSync} from './pollingSaga'
import { put } from 'redux-saga/effects'
import { polling_action_types, dispatchApiSync } from '../actions/poll-actions'

test('pollingSaga', () => {
    const gen = apiSync()
    expect(gen.next().value).toEqual(put(dispatchApiSync()))
});