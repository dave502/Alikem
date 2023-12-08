from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, \
    ReplyKeyboardRemove
from aiogram.filters.callback_data import CallbackData
from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder


def admin_menu() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()

    builder.row(
        KeyboardButton(text="👨 Пользователи"),
        KeyboardButton(text="💳 Оплаты"),
    )
    builder.row(
        KeyboardButton(text="📃 Лог telegram"),
        KeyboardButton(text="Все процедуры"),
    )
    builder.row(
        KeyboardButton(text="Все Регионы"),
        KeyboardButton(text="Изменения"),
    )
    builder.row(
        KeyboardButton(text="▶️ Start cron"),
        KeyboardButton(text="⏲ Лог cron"),
    )
    builder.row(
        KeyboardButton(text="❌ Удалиться"),
        KeyboardButton(text="◀️ Выйти"),
    )
    return builder.as_markup()


def user_menu() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()

    # builder.row(
    #     KeyboardButton(text="👨 Пользователи"),
    #     KeyboardButton(text="💳 Оплаты"),
    # )
    builder.row(
        KeyboardButton(text="🗃️ Создать задачу"),
        KeyboardButton(text="🧾 Сбросить"),
    )
    builder.row(
        KeyboardButton(text="☑️ Выбрать регионы"),
        KeyboardButton(text="🔎 Доступные регионы"),
    )
    builder.row(
        KeyboardButton(text="💳 Цены"),
        KeyboardButton(text="ℹ️ О боте"),
    )
    builder.row(
        KeyboardButton(text="📇 Поддержка"),
        KeyboardButton(text="◀️ Выйти"),
    )
    return builder.as_markup()


def finish_content_menu() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()

    builder.row(
        KeyboardButton(text="✅ Описание готово"),
        KeyboardButton(text="📃 Отправить ещё"),
    )
    return builder.as_markup(resize_keyboard=True, one_time_keyboard=True) #

first_menu = [
    [InlineKeyboardButton(text="ℹ️ Узнать подробности о работе бота", callback_data="bot_info")],
    [InlineKeyboardButton(text="🧾 Открыть договор об оказании услуг", callback_data="contract")],
    [InlineKeyboardButton(text="💳 Цены", callback_data="pricelist")],
    [InlineKeyboardButton(text="🔎 Список доступных регионов", callback_data="active_regions")],
]
first_menu = InlineKeyboardMarkup(inline_keyboard=first_menu)

second_menu = [
    [InlineKeyboardButton(text="🧾 Открыть договор об оказании услуг", callback_data="contract")],
    [InlineKeyboardButton(text="🔎 Список доступных регионов", callback_data="active_regions")],
]
second_menu = InlineKeyboardMarkup(inline_keyboard=second_menu)

agreement_menu = [
    [InlineKeyboardButton(text="🧾 Открыть договор об оказании услуг", callback_data="contract")],
]
agreement_menu = InlineKeyboardMarkup(inline_keyboard=agreement_menu)


accept_contract_menu = [
    [InlineKeyboardButton(text="📝 Принять условия договора", callback_data="accept_contract")],
]
accept_contract_menu = InlineKeyboardMarkup(inline_keyboard=accept_contract_menu)
#

payment_button = [
    [KeyboardButton(text="Итого к оплате \n Нажмите, чтобы оплатить", pay=True)],
]
payment_button = ReplyKeyboardMarkup(keyboard=payment_button,
                                     resize_keyboard=True,
                                     callback_data="pay")



task_desc_ready = [[InlineKeyboardButton(text="Завершить", callback_data="task_desc_ready")]]
task_desc_ready = InlineKeyboardMarkup(inline_keyboard=task_desc_ready)


change_topic = [[InlineKeyboardButton(text="Изменить", callback_data="change_topic")]]
change_topic = InlineKeyboardMarkup(inline_keyboard=change_topic)

send_task = [[InlineKeyboardButton(text="Отправить", callback_data="send_task")]]
send_task = InlineKeyboardMarkup(inline_keyboard=send_task)

take_task = [[InlineKeyboardButton(text="Откликнуться", callback_data="take_task"),
              InlineKeyboardButton(text="Вопрос", callback_data="question")]]
take_task = InlineKeyboardMarkup(inline_keyboard=take_task)

"""
Кнопки для выбора раздела
"""


class CheckedCallbackFactory(CallbackData, prefix="thread_id_"):
    action: str = "check"
    checked: bool = False
    index: int | None = None
    value: int


def list_of_threads_kb(threads) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    [builder.button(text=thread,
                    callback_data=CheckedCallbackFactory(index=i, value=idx),
                    )
     for i, (idx, thread) in enumerate(threads.items())]
    builder.button(
        text="🟥 Пропустить 🟥", callback_data=CheckedCallbackFactory(action="thread_selected", value=0), )
    builder.adjust(1)

    return builder.as_markup()
