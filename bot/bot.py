import os
import pathlib
import asyncio
from aiogram import Bot, Dispatcher, exceptions
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
# from db.queries import SubscriptionQuery
from handlers import router
from aiogram.utils.callback_answer import CallbackAnswerMiddleware
from db.init_db import new_db, init_db
from db.config import async_session, DATABASE_URL
from middlewares import DbSessionMiddleware
from dotenv import dotenv_values
from logger.logger import setup_logger

env = dotenv_values(".bot.env")
TG_LOGGER_NAME = "tg"

async def main():

    token = os.getenv("BOT_TOKEN") or env.get("BOT_TOKEN")
    if not token:
        logger.error("Failed to get telegram token")
        return

    bot = Bot(token=token, parse_mode=ParseMode.HTML)
    dp = Dispatcher(storage=MemoryStorage())
    dp.update.middleware(DbSessionMiddleware(session_pool=async_session))
    dp.callback_query.middleware(CallbackAnswerMiddleware())
    dp.include_router(router)
    await bot.delete_webhook(drop_pending_updates=True)

    try:
        logger.info(f"Bot started")
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await dp.storage.close()
        await bot.session.close()
        logger.info(f"Bot stopped")


if __name__ == "__main__":

    # init telegram logger
    #app_path = pathlib.Path(__file__).parent.resolve().parents[0]
    logger = setup_logger(TG_LOGGER_NAME, f'logs/{TG_LOGGER_NAME}.log')
    logger.info("Logger has been initialized")

    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.error("Bot stopped!")
