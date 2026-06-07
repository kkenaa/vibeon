import { reactive } from "vue";

interface EditingRowState {
  row: any;
  index: number;
}

const state = reactive<EditingRowState>({
  row: null,
  index: -1,
});

export const editingRowStore = {
  getEditingRow() {
    return state.row;
  },

  getEditingIndex() {
    return state.index;
  },

  setEditingRow(row: any, index: number) {
    state.row = JSON.parse(JSON.stringify(row));
    state.index = index;
  },

  clearEditingRow() {
    state.row = null;
    state.index = -1;
  },
};
