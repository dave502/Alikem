from aiogram.fsm.state import StatesGroup, State

class CreatingTask(StatesGroup):
    start = State()
    creating_title = State()
    selecting_thread = State()
    creating_content = State()
    creating_price = State()
    creating_date = State()
    finish = State()